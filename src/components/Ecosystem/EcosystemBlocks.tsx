// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
//
import React from 'react';
import styled from 'styled-components';
import { device } from '@site/src/config/globals';

import EcosystemCard from './EcosystemCard';
import { H2 } from '@site/src/css/SharedStyling';

export type EcosystemApp = {
  id: number;
  name: string;
  description: string;
  icon: string;
  bgImage: string;
  bgGradientColor: string;
  tags: string[];
  twitterId?: string;
  href?: string;
  titleColor?: string;
  descriptionColor?: string;
  tagsColor?: string;
  comingsoon?: boolean;
  appoftheweek: true;
};

type Props = {
  apps: EcosystemApp[];
  title?: string;
};

const EcosystemBlocks: React.FC<Props> = ({ apps }) => {
  return (
    <>
      <H2 fontSize='26px' fontWeight='600'>
        Testnet Donut Alpha Apps
      </H2>
      <Grid>
        {apps.map((app) => (
          <EcosystemCard key={app.name} app={app} />
        ))}
      </Grid>
    </>
  );
};

export default EcosystemBlocks;

const Grid = styled.div`
  display: grid;
  margin-top: 32px;
  gap: clamp(16px, 2.5vw, 24px);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

  @media ${device.laptop} {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
`;
