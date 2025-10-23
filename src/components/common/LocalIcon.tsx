import React from 'react';

import * as Icons from '@/assets/images/svg';

interface ILocalIconProps {
  name: keyof typeof Icons;
  width: number | string;
  height: number | string;
}

const LocalIcon: React.FC<ILocalIconProps> = ({ name, width, height }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`LocalIcon ${String(name)} not found`);
    return null;
  }

  return <IconComponent width={width} height={height} />;
};

export default LocalIcon;
