import React, { ReactElement, useMemo } from 'react';
import styles from './ObjectsRenderer.module.scss';
import classNames from 'classnames';

export enum SectorPosition {
  Left,
  Right,
  Top,
  Bottom,
  Center,
  South
}

export enum RendererType {
  Flex,
  Grid
}

export interface ObjectRendererProps {
  children: React.ReactNode [] | React.ReactNode;
  rendererType?: RendererType;
  sectorPosition?: SectorPosition,
}

const ObjectsRenderer = ({ children, rendererType = RendererType.Flex, sectorPosition = SectorPosition.Center }: ObjectRendererProps) => {
  const nodes = useMemo(() => {
    if (!Array.isArray(children)) {
      return children;
    }

    return React.Children.map(children.filter((el) => React.isValidElement(el)), (el) => {
      return React.cloneElement(el as ReactElement);
    });
  }, [children]);
  
  if (rendererType === RendererType.Flex) {
    return (
      <div className={'info'}>
        <div className={styles.flex}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={classNames({
      [styles.center]: sectorPosition === SectorPosition.Center,
      [styles.top]: sectorPosition === SectorPosition.Top,
      [styles.bottom]: sectorPosition === SectorPosition.Bottom,
      [styles.left]: sectorPosition === SectorPosition.Left,
      [styles.right]: sectorPosition === SectorPosition.Right,
      [styles.south]: sectorPosition === SectorPosition.South
    })}>
      {nodes}
    </div>
  );
};

export default ObjectsRenderer;
