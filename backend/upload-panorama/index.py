import json
import os
import uuid
import base64
import boto3
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']

def handler(event: dict, context) -> dict:
    """Загружает панорамное фото в S3 и сохраняет ссылку в БД."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if event.get('httpMethod') == 'GET':
        memorial_id = (event.get('queryStringParameters') or {}).get('memorial_id', 'kotova')
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, spot_id, label, url, created_at FROM {SCHEMA}.tour_panoramas WHERE memorial_id = %s ORDER BY created_at DESC",
            (memorial_id,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        panoramas = [
            {'id': r[0], 'spot_id': r[1], 'label': r[2], 'url': r[3], 'created_at': r[4].isoformat()}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'panoramas': panoramas})}

    body = json.loads(event.get('body') or '{}')
    memorial_id = body.get('memorial_id', 'kotova')
    spot_id = body.get('spot_id', '')
    label = body.get('label', 'Новая точка')
    image_b64 = body.get('image_b64', '')
    content_type = body.get('content_type', 'image/jpeg')

    if not image_b64:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'image_b64 required'})}

    image_data = base64.b64decode(image_b64)
    ext = 'jpg' if 'jpeg' in content_type else content_type.split('/')[-1]
    key = f"panoramas/{memorial_id}/{uuid.uuid4()}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=image_data, ContentType=content_type)
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.tour_panoramas (memorial_id, spot_id, label, url) VALUES (%s, %s, %s, %s) RETURNING id",
        (memorial_id, spot_id, label, cdn_url)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'id': new_id, 'url': cdn_url, 'label': label, 'spot_id': spot_id}),
    }
