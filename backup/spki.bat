openssl x509 -pubkey -noout -in ecdsa_cert.pem | openssl ec -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64