// 환경 변수가 없을 경우를 대비해 기본값 설정
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://3.106.116.44:8080';
console.log('API 서버 URL:', BASE_URL);
export const apiServer = BASE_URL;