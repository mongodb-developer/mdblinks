cd /docker-entrypoint-initdb.d
for file in ./*.json
do
  echo "Importing $file"
  mongoimport --uri="mongodb://mdblink:mdblink@localhost:27017" --db=routes --authenticationDatabase=admin --jsonArray $file
done

