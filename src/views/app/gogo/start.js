import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IconCardsCarousel from 'containers/dashboards/IconCardsCarousel';
import QuickPost from 'containers/dashboards/QuickPost';
import BestSellers from 'containers/dashboards/BestSellers';

const Start = ({ match }) => (
  <>
    <Row>
      <Colxx xxs="12">
        <Breadcrumb heading="menu.start" match={match} />
        <Separator className="mb-5" />
      </Colxx>
    </Row>
    <Row>
      <Colxx lg="12" xl="6">
        <IconCardsCarousel />
        <Row>
          <Colxx md="12" className="mb-4">
            <QuickPost />
          </Colxx>
        </Row>
      </Colxx>
      <Colxx lg="12" xl="6" className="mb-4">
        <BestSellers title="dashboards.top-viewed-posts" />
      </Colxx>
    </Row>
  </>
);
export default Start;
