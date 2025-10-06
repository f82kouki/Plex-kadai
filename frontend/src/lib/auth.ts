export type LoginRes = { user: { id: number; email: string; role: 'intern'|'company' } };


export const saveToken = (res: Response) => {
  const token = res.headers.get('Authorization')?.replace('Bearer ', '');
  if (token) localStorage.setItem('jwt', token);
};


export const clearToken = () => localStorage.removeItem('jwt');