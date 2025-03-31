//  variables.pkr.hcl

// For those variables that you don't provide a default for, you must
// set them from the command line, a var-file, or the environment.

# This is the name of the node in the Cloud Cluster where to deploy the virtual instances
locals {
  NODENAME = vault("/secret/data/NODENAME","SYSTEM41")
}

locals {
  NODENAME2 = vault("/secret/data/NODENAME","SYSTEM42")
}

# Add your name and PK-USERNAME value to vault's /secret/data/SECRETKEY/<YOURNAME>
# And then change TIBRAHIM to your name
locals {
  USERNAME = vault("/secret/data/SECRETKEY/TIBRAHIM","PK_USERNAME")
}

# Add your name and PK-TOKEN value to vault's /secret/data/SECRETKEY/<YOURNAME>
# And then change TIBRAHIM to the your name
locals {
  PROXMOX_TOKEN = vault("/secret/data/ACCESSKEY/TIBRAHIM","PK_TOKEN")
}

locals {
  URL = vault("/secret/data/URL","S41")
}

locals {
  SSH_PW = vault("/secret/data/SSH","SSH_PW")
}
locals {
  SSH_USER = vault("/secret/data/SSH","SSH_USER")
}

# This will be the non-root user account name
locals { 
  DB_USER = vault("/secret/data/DB","USERNAME")
}

# This will be the Database user (non-root) password setup
locals {
  DB_PASS = vault("/secret/data/DB","PASSWORD")
}

locals {
  DB_URL = vault("/secret/data/DB", "URL")
}

locals {
  DB_NAME = vault("/secret/data/DB", "DATABASE_NAME")
}

locals {
  DB_IP = vault("/secret/data/DB", "IP")
}

locals {
  SV_PORT = vault("/secret/data/SV", "PORT")
}

locals {
  SV_URL = vault("/secret/data/SV", "URL")
}

locals {
  SV_SECRET_KEY = vault("/secret/data/SV", "SECRET_KEY")
}

locals {
  SV_EXPIRES_IN = vault("/secret/data/SV", "EXPIRES_IN")
}

locals {
  OAUTH_CLIENT_ID = vault("/secret/data/AUTH/GOOGLE", "CLIENT_ID")
}

locals {
  OAUTH_CLIENT_SECRET = vault("/secret/data/AUTH/GOOGLE", "CLIENT_SECRET")
}

locals {
  OAUTH_REDIRECT_URI = vault("/secret/data/AUTH/GOOGLE", "REDIRECT_URI")
}

##############################################################################
# This set of variables controls the resources allocated to building the 
# VM templates -- the resources can be low because we will expand/declare the
# resources we want when we deploy instances from these templates via Terraform
###############################################################################
variable "MEMORY" {
  type    = string
  default = "4096"
}

# Best to keep this low -- you can expand the size of a disk when deploying 
# instances from templates - but not reduce the disk size -- No need to edit this
variable "DISKSIZE" {
  type    = string
  default = "25G"
}

# This is the name of the disk the build template will be stored on in the 
# Proxmox cloud -- No need to edit this
variable "STORAGEPOOL" {
  type    = string
  default = "datadisk1"
}

variable "NUMBEROFCORES" {
  type    = string
  default = "1"
}

# This is the name of the Virtual Machine Template you want to create
variable "frontend-VMNAME" {
  type    = string
  default = "team05m-prod-fe"
}

variable "backend-VMNAME" {
  type    = string
  default = "team05m-prod-be"
}

# This is the name of the Virtual Machine Template you want to create
variable "database-VMNAME" {
  type    = string
  default = "team05m-prod-db"
}

# This is the name of the Virtual Machine Template you want to create
variable "loadbalancer-VMNAME" {
  type    = string
  default = "team05m-prod-lb"
}

variable "iso_checksum" {
  type    = string
  default = "file:https://mirrors.edge.kernel.org/ubuntu-releases/22.04.5/SHA256SUMS"
}

variable "iso_urls" {
  type    = list(string)
  default = ["http://mirrors.edge.kernel.org/ubuntu-releases/22.04.5/ubuntu-22.04.5-live-server-amd64.iso"]
}

variable "local_iso_name" {
  type    = string
  default = "ubuntu-22.04.5-live-server-amd64.iso"
}

variable "FE-TAGS" {
  type = string
  default  = "frontend;team05m"
}

variable "BE-TAGS" {
  type = string
  default  = "backend;team05m"
}

variable "DB-TAGS" {
  type = string
  default  = "database;team05m"
}

# Use the tags for your team name and what type of artifact this is
variable "LB-TAGS" {
  type = string
  default  = "loadbalancer;team05m"
}
