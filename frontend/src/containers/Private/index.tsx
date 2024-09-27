import { Navigate, Outlet, useLocation } from 'react-router';
import useAuthStore from '../../store/auth';

type PrivatePropsType = {
  redirectPath?: string;
  children?: any;
};

const Private: React.FC<PrivatePropsType> = ({
  redirectPath = '/auth',
  children,
}) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const location = useLocation();
  console.log('isLogin', isLogin);
  if (!isLogin) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children || <Outlet />;
};
export default Private;
