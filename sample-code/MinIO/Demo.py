from minio import Minio

# This program tests the various functions of MinIO on python.
# It is assumed that MinIO is installed.


################################################################
# Connect client to a MinIO server
################################################################
'''
The particular server is a public server cluster. So be careful not
to post sensitive data on it. Endpoint is the name of the server,
an access key acts as the username while the secret key acts as a
password to the server.
'''

# Create a client
client = Minio(endpoint="play.min.io",
               access_key="Q3AM3UQ867SPQQA43P2F",
               secret_key="zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
               secure=True)

# Get the total buckets stored in the endpoint
print("Total buckets: ", len(client.list_buckets()))

################################################################
# Create a bucket on MinIO server
################################################################
'''
MinIO uses buckets to store objects, which allows to store
various file types. This code was tested and works.
'''

# Bucket name
bucket_name = "ITMT-430-Team05"

# Create the bucket if it doesn't exist.
found = client.bucket_exists(bucket_name)
if not found:
   client.make_bucket(bucket_name)
   print("Created bucket", bucket_name)
else:
  print("Bucket", bucket_name, "already exists")


################################################################
# Upload a textfile to MinIO public server
################################################################
'''
This section assumes that the local computer has the existing files folders
as seen in some of the variables. This code was tested and works.
'''

# The file to upload, change this path if needed
source_file = "/home/vagrant/textFile.txt"

# The destination bucket and object name on the MinIO server
bucket_name = "ITMT-430-Team05"
destination_file = "testTextFile.txt"

# Upload the text file, renaming it in the process
client.fput_object(bucket_name, destination_file, source_file,)
print(source_file, "successfully uploaded as object", destination_file, "to bucket", bucket_name,)

################################################################
# Upload a JPEG file to MinIO public server
################################################################
'''
This section assumes that the local computer has the existing files folders
as seen in some of the variables. This code was not tested.
'''

bucket_name = "ITMT-430-Team05"               # Name of the bucket that is on the minIO server
object_name = "somePictureSaved.jpeg"         # The file becomes an object on the MinIO server, and so we must give it a object name of our choosing
source_file = "home/vagrant/somePicture.jpeg" # File path from your computer where the file is located
content_type = "image/jpeg"                   # The file type and the file format

# Upload the image
result = client.fput_object(bucket_name, object_name, source_file, content_type="image/jpeg")

# Display meta data
# Source: https://www.youtube.com/watch?v=To0nHxt0osI
print("Created {0} with etag: {1}, version-id: {2}".format(result.object_name, result.etag, result.version_id,))

################################################################
# Download a object of MinIO public server to local computer
################################################################
'''
This section assumes that the local computer has the existing files folders
as seen in some of the variables. This code was not tested.
'''

# Download the image
download_location = "home/vagrant/savedImages/somePicture.jpeg" # File path the downloaded object will be placed
result = client.fget_object(bucket_name, object_name, download_location)

# Display meta data
# Source: https://resources.min.io/c/how-to-download-a-file-from-minio-using-python?x=p9k0ng
print("Download {0} with etag: {1}, version-id: {2}".format(result.object_name, result.etag, result.version_id,))