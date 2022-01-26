import { renderRoutes } from 'react-router-config';

export const TokenListTemplate = (props: any) => {
  return <div>{renderRoutes(props.route.routes)}</div>;
};
