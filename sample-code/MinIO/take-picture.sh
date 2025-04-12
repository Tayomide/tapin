
# This was a failed investigation of telling the camera to take
# a picture and then execute python code to upload the image.


# Take a picture of the user
# Source: https://www.raspberrypi.com/news/raspberry-pi-camera-module-still-image-capture/
libcamera-still -q 80 -o login.jpeg

# Run the python program to upload the image to MinIO
python3 upload_image.py

# Delete the image from the local computer
rm login.jpeg