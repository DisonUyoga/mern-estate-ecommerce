import './index.scss'
import Helmet from '../../components/Helmet'
import React from 'react';

const About = () => {
  return <Helmet title="About">
    <div className="py-20 px-4 mx-auto max-w-6xl">
      <h1 className='font-bold text-3xl mb-4 text-slate-800'>About D&W Estate</h1>

      <p className="mb-4 text-slate-700">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis nisi incidunt odio minima similique recusandae ducimus asperiores cum saepe illum vero molestiae, aliquam, perspiciatis velit cumque eligendi explicabo quam eaque!</p>

      <p className="mb-4 text-slate-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus sunt totam eligendi praesentium unde saepe corporis aspernatur voluptate est sapiente.</p>

      <p className="mb-4 text-slate-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, consequuntur? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem doloribus tempore consequuntur assumenda expedita, ut esse perferendis dolor repudiandae voluptatibus?</p>
    </div>
  </Helmet>
}

export default About;
