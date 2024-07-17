openssl x509 -in ssl_cert.pem -pubkey -noout 
  openssl pkey -pubin -outform der 
  openssl dgst -sha256 -binary 
  openssl enc -base64