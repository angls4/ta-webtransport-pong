openssl ecparam -name secp256r1 -genkey -noout -out working_key.pem

openssl req -new -key working_key.pem -out working_csr.pem -config cert.cnf

openssl x509 -req -in working_csr.pem -signkey working_key.pem -out working_cert.pem -days 13 -sha256
