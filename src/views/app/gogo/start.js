import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import CourseContents from 'containers/pluralsight/CourseContents';
import ImageCardList from 'containers/ui/ImageCardList';


const Start = ({ match }) => {


  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.start" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx lg="12" xl="12" className="mb-4">
          <CourseContents title="dashboards.top-viewed-posts" />
        </Colxx>
      </Row>
      <Row>
        <ImageCardList/>
      </Row>
    </>
  );
};
export default Start;
