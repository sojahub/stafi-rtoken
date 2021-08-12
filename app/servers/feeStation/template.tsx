import React from 'react';
import { renderRoutes } from 'react-router-config';

export default function FeeStationTemplate(props: any) {
  return <div>{renderRoutes(props.route.routes)}</div>;
}
