from minio import Minio

# This program uploads the image file onto a bucket on MinIO
# The file paths are based on a jammy64 VM.

# Create a client
client = Minio(endpoint="play.min.io",
               access_key="Q3AM3UQ867SPQQA43P2F",
               secret_key="zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
               secure=True)

bucket_name = "ITMT-430-Team05"             # Name of the bucket that is on the minIO server
object_name = "login.jpeg"                  # The file becomes an object on the MinIO server, and so we must give it a object name of our choosing
source_file = "home/vagrant/login.jpeg"     # File path from your computer where the file is located
content_type = "image/jpeg"                 # The file type and the file format

# Upload the image
result = client.fput_object(bucket_name, object_name, source_file, content_type="image/jpeg")

# Display meta data
# Source: https://www.youtube.com/watch?v=To0nHxt0osI
print("Created {0} with etag: {1}, version-id: {2}".format(result.object_name, result.etag, result.version_id,))
