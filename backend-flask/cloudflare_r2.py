import os
import boto3

R2_ENDPOINT = os.environ.get('R2_ENDPOINT')
R2_BUCKET = os.environ.get('R2_BUCKET')
R2_KEY = os.environ.get('R2_KEY')
R2_SECRET = os.environ.get('R2_SECRET')

def get_r2_client():
    return boto3.client(
        's3',
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_KEY,
        aws_secret_access_key=R2_SECRET
    )

def upload_to_r2(fileobj, filename, content_type='application/octet-stream'):
    client = get_r2_client()
    client.upload_fileobj(
        fileobj,
        R2_BUCKET,
        filename,
        ExtraArgs={'ACL': 'public-read', 'ContentType': content_type}
    )
    return f"https://{R2_ENDPOINT.split('//')[-1]}/{R2_BUCKET}/{filename}"

def delete_from_r2(filename):
    client = get_r2_client()
    client.delete_object(Bucket=R2_BUCKET, Key=filename)
