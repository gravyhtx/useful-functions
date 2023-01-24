import { verify, sign } from 'bcrypt';

// set token secret and expiration date
const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'mysecretsshhhhh';
const expiration = '2h';

export function authMiddleware(req: any, res: any, next: any) {
  // allows token to be sent via  req.query or headers
  let token = req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return res.status(400).json({ message: 'You have no token!' });
  }

  // verify token and get user data out of it
  try {
    const { data } = verify(token, secret, { maxAge: expiration });
    return data;
  } catch {
    return res.status(400).json({ message: 'invalid token!' });
  }

}
export function signToken({ email, _id }) {
  const payload = { email, _id };

  return sign({ data: payload }, secret, { expiresIn: expiration });
}
