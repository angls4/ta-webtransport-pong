openssl ecparam -name secp256r1 -genkey -noout -out ecdsa_key.pem
openssl req -new -x509 -key ecdsa_key.pem -out ecdsa_cert.pem -days 13 -config ecdsa.cfg -sha256
