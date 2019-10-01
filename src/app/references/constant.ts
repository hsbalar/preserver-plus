import { environment } from 'src/environments/environment';

export const QNA_DOCUMENT = `qna_pair_document`;
export const QNA_COLLECTION_DOCUMENT = `qna_collection_document`;

export const AUTH_BASE_URL = environment.apiUrl;
export const LOGIN = `auth/login`;
export const REGISTER = `auth/register`;
export const LOGOUT = `auth/logout`;