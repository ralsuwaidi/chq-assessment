import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import BestSellers from 'containers/dashboards/BestSellers';
import { useQuery, gql } from '@apollo/client';

const COURSE_CATALOG = gql`
  query {
    courseCatalog(first: 10) {
      nodes {
        title
      }
    }
  }
`;

const Start = ({ match }) => {
  const { loading, error, data } = useQuery(COURSE_CATALOG);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(error);
  if (!loading) {
    console.log(data);
  }

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
          <BestSellers title="dashboards.top-viewed-posts" />
        </Colxx>
      </Row>
    </>
  );
};
export default Start;
