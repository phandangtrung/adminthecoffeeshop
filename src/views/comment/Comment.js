import React, { lazy, useState, useEffect } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CLink,
} from "@coreui/react";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Table,
  Space,
  Spin,
  Row,
  Col,
  Input,
  Form,
  notification,
  Button,
  Popconfirm,
  Rate,
} from "antd";

import commentApi from "../../api/commentApi";
import productApi from "../../api/productApi";

function Comment() {
  const { Search } = Input;
  const [isLoading, setIsLoading] = useState(false);
  const [tabledata, settabledata] = useState([]);
  const [proList, setproList] = useState([]);
  const [fakecmtList, setfakecmtList] = useState([]);
  const deleteComment = (record) => {
    console.log("record: ", record);

    const fetchDeleteComment = async () => {
      try {
        setIsLoading(true);
        const response = await commentApi.deletecomment(record._id);
        console.log("Fetch user succesfully: ", response);
        settabledata(tabledata.filter((cmmt) => cmmt._id !== record._id));
        setIsLoading(false);
      } catch (error) {
        console.log("failed to delete comment: ", error);
      }
    };
    fetchDeleteComment();
  };
  const getPronamebyid = (proid) => {
    const probj = proList.filter((dataget) => proid === dataget._id);
    const finalname = probj[0]?.name;
    if (finalname === undefined) return <div>Deleted</div>;
    else return <div>{finalname}</div>;
  };
  const onSearch = (values) => {
    if (values === "") {
      settabledata(fakecmtList);
    } else {
      const filteredProduct = fakecmtList.filter((cmt) => {
        return cmt.content.toLowerCase().indexOf(values.toLowerCase()) !== -1;
      });
      console.log(">>>filteredProduct", filteredProduct);
      if (filteredProduct.length > 0) settabledata(filteredProduct);
    }
  };
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Product",
      dataIndex: "productId",
      key: "productId",
      render: (proid) => getPronamebyid(proid),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (num) => <Rate disabled defaultValue={num} />,
    },

    {
      title: "Action",
      key: "action",
      width: 200,
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => deleteComment(record)}
          >
            <Button type="primary" danger>
              <span>Delete</span>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getAll();
        console.log("Fetch product succesfully: ", response);
        setproList(response.productList);
      } catch (error) {
        console.log("failed to delete comment: ", error);
      }
    };
    const fetchCategoryList = async () => {
      // dispatch({ type: "FETCH_INIT" });
      try {
        setIsLoading(true);
        const response = await commentApi.getall();
        console.log("Fetch comment succesfully: ", response);
        fetchProduct();
        settabledata(response.comments);
        setfakecmtList(response.comments);
        setIsLoading(false);
      } catch (error) {
        console.log("failed to fetch comment list: ", error);
      }
    };
    fetchCategoryList();
  }, []);
  return (
    <>
      <CCard>
        <CCardHeader className="CCardHeader-title ">Comment</CCardHeader>
        <Row>
          <Col lg={15}></Col>
          <Col lg={8}>
            <Search
              style={{
                width: "100%",
                height: "50px",
                margin: "30px",
              }}
              placeholder="Search commnet"
              onSearch={onSearch}
            />
          </Col>
        </Row>
        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table columns={columns} dataSource={tabledata} rowKey="_id" />
        )}
      </CCard>
    </>
  );
}

export default Comment;
