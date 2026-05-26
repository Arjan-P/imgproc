#! /bin/bash
sudo docker exec -it infra-db-1 psql -U postgres -d imgproc_db
