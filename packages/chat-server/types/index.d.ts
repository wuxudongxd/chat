interface RESPONSE {
  code: 'ok' | 'fail' | 'error';
  msg: string;
  data: any;
}
