import React, { FC, ComponentType } from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouterProps,
  Redirect
} from 'react-router-dom';

import { useAuth } from '../hooks/Auth';

interface RouteProps extends ReactDOMRouterProps{
  isPrivate?: boolean;
  component: ComponentType;
}

const Route: FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect to={{
            pathname: isPrivate ? '/' : '/dashboard',
            state: location
          }} />
        )
      }}
    />
  );
}

export default Route;
