#!/bin/bash

sudo firewall-cmd --zone=meta-network --add-port=8000/tcp --permanent

sudo firewall-cmd --reload