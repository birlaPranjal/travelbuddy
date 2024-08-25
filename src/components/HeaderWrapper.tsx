import { AuthStatus } from './AuthStatus';
import Header from './Header';

export default async function HeaderWrapper() {
  const { isAuthenticated } = await AuthStatus();

  return <Header initialIsAuthenticated={isAuthenticated} />;
}