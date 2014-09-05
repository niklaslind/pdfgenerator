i=$1
urlfile="/tmp/urls"$i
echo $urlfile
curl -X POST -d@test.html "http://localhost:8080/pdf" | jsonlint | grep pdfurl | cut -d\" -f 4 > $urlfile
url=http://localhost:8080`cat $urlfile`
echo $url
curl -X GET $url > /tmp/t$i.pdf
open /tmp/t$i.pdf
