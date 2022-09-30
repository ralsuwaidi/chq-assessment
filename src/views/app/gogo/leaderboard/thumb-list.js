import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { servicePath } from 'constants/defaultValues';
import ListPageListing from 'containers/pages/ListPageListing';
import useMousetrap from 'hooks/use-mousetrap';
import ListPageHeadingAssessment from 'containers/pages/ListPageHeadingAssessment';
import { gql, useQuery } from '@apollo/client';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const apiUrl = `${servicePath}/cakes/paging`;

const orderOptions = [
  { column: 'title', label: 'Product Name' },
  { column: 'category', label: 'Category' },
  { column: 'status', label: 'Status' },
];
const pageSizes = [4, 8, 12, 20];

const ThumbListPages = ({ match }) => {
  const [displayMode, setDisplayMode] = useState('thumblist');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(8);
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'title',
    label: 'Product Name',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [after, setAfter] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    async function fetchData() {
      axios
        .get(
          `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`
        )
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          setTotalPage(data.totalPage);
          // setItems(
          //   data.data.map((x) => {
          //     return { ...x, img: x.img.replace('img/', 'img/products/') };
          //   })
          // );
          setSelectedItems([]);
          setTotalItemCount(data.totalItem);
        });
    }
    fetchData();
  }, [selectedPageSize, currentPage, selectedOrderOption, search]);

  const COURSE_CATALOG = gql`
    query {
      skillAssessmentCatalog(first: ${selectedPageSize}, after: "${after}") {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          name
          imageUrl
          url
          updatedOn
          description
          domain
          state
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(COURSE_CATALOG);

  console.log('loading', loading);
  console.log('error', error);
  if (!loading) console.log('current data', items);
  if (!loading) console.log('data', data.skillAssessmentCatalog.nodes);

  useEffect(() => {
    async function fetchPlural() {
      if (data) {
        const PluralData = data.skillAssessmentCatalog.nodes;
        const itemList = [];
        for (let index = 0; index < PluralData.length; index += 1) {
          const element = PluralData[index];

          const item = {
            category: element.domain,
            date: element.updatedOn,
            description: element.description,
            id: element.id,
            img: element.imageUrl,
            sales: 2,
            status: element.state,
            statusColor: 'primary',
            stock: 2,
            title: element.name,
            url: element.url,
          };

          itemList.push(item);
        }

        console.log('test_me', itemList);
        // Update the document title using the browser API
        setItems(itemList);
      }
    }
    fetchPlural();
  }, [data]);

  const onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true;
    }
    if (lastChecked === null) {
      setLastChecked(id);
    }

    let selectedList = [...selectedItems];
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let newItems = [...items];
      const start = getIndex(id, newItems, 'id');
      const end = getIndex(lastChecked, newItems, 'id');
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...newItems.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedItems));
      setSelectedItems(selectedList);
    }
    document.activeElement.blur();
    return false;
  };

  const handleChangeSelectAll = (isToggle) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems(items.map((x) => x.id));
    }
    document.activeElement.blur();
    return false;
  };

  const onContextMenuClick = (e, contextData) => {
    // params : (e,data,target)
    console.log('onContextMenuClick - selected items', selectedItems);
    console.log('onContextMenuClick - action : ', contextData.action);
  };

  const onContextMenu = (e, contextData) => {
    const clickedProductId = contextData.data;
    if (!selectedItems.includes(clickedProductId)) {
      setSelectedItems([clickedProductId]);
    }

    return true;
  };

  useMousetrap(['ctrl+a', 'command+a'], () => {
    handleChangeSelectAll(false);
  });

  useMousetrap(['ctrl+d', 'command+d'], () => {
    setSelectedItems([]);
    return false;
  });

  useMousetrap(['ctrl+n', 'command+n'], () => {
    setAfter(data.skillAssessmentCatalog.pageInfo.endCursor);
  });

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return loading ? (
    <div className="loading" />
  ) : (
    <>
      <div className="disable-text-selection">
        <ListPageHeadingAssessment
          heading="menu.thumb-list"
          displayMode={displayMode}
          changeDisplayMode={setDisplayMode}
          handleChangeSelectAll={handleChangeSelectAll}
          changeOrderBy={(column) => {
            setSelectedOrderOption(
              orderOptions.find((x) => x.column === column)
            );
          }}
          changePageSize={setSelectedPageSize}
          selectedPageSize={selectedPageSize}
          totalItemCount={totalItemCount}
          selectedOrderOption={selectedOrderOption}
          match={match}
          startIndex={startIndex}
          endIndex={endIndex}
          onSearchKey={(e) => {
            if (e.key === 'Enter') {
              setSearch(e.target.value.toLowerCase());
            }
          }}
          orderOptions={orderOptions}
          pageSizes={pageSizes}
          toggleModal={() => setModalOpen(!modalOpen)}
        />
        <ListPageListing
          items={items}
          displayMode={displayMode}
          selectedItems={selectedItems}
          onCheckItem={onCheckItem}
          currentPage={currentPage}
          totalPage={totalPage}
          onContextMenuClick={onContextMenuClick}
          onContextMenu={onContextMenu}
          onChangePage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ThumbListPages;
