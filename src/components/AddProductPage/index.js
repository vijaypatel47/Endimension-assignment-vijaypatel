import {Form, Input, Button, message} from 'antd'
import {useHistory} from 'react-router-dom'

import './index.css'

const AddProductPage = () => {
  const history = useHistory()

  const onFinish = values => {
    console.log('Form submitted with values:', values)
    fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(response => {
        if (response.ok) {
          message.success('Product added successfully!')
          history.push('/')
        } else {
          message.error('Failed to add product!')
        }
      })
      .catch(error => {
        console.error('Error adding product:', error)
        message.error('Failed to add product!')
      })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
    message.error('Please fill in all required fields!')
  }

  return (
    <div className="add-product-page-cont">
      <h1 className="add-product-head">Add Product</h1>
      <Form
        layout="vertical"
        name="addProductForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Category"
          name="category"
          rules={[{required: true, message: 'Please enter the category!'}]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{required: true, message: 'Please enter the name!'}]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{required: true, message: 'Please enter the description!'}]}
        >
          <Input type="textarea" row="5" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{required: true, message: 'Please enter the price!'}]}
        >
          <Input type="number" min={0} step={0.01} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddProductPage
