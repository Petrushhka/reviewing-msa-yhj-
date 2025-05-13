import { Container, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={styles['footer-container']}>
      <section className={styles['footer-subscription']}>
        <p className={styles['footer-subscription-heading']}>
          <a
            href='https://www.flaticon.com/kr/free-icons/-'
            title='레벨 배지 아이콘'
            className={styles['unique-link']} // CSS 모듈 사용 시
            target='_blank'
            rel='noopener noreferrer'
          >
            레벨 배지 아이콘 제작자: Kason Koo - Flaticon
          </a>
        </p>
      </section>
      <div className={styles['footer-links']}>
        <div className={styles['footer-link-wrapper']}>
          <div className={styles['footer-link-items']}>
            <h2>About Us</h2>
            <Link to='/sign-up'>How it works</Link>
            <Link to='/'>Testimonials</Link>
            <Link to='/'>Careers</Link>
            <Link to='/'>Investors</Link>
            <Link to='/'>Terms of Service</Link>
          </div>
        </div>
        <div className={styles['footer-link-wrapper']}>
          <div className={styles['footer-link-items']}>
            <h2>Contact Us</h2>
            <Link to='/'>Contact</Link>
            <Link to='/'>Support</Link>
            <Link to='/'>Destinations</Link>
            <Link to='/'>Sponsorships</Link>
          </div>
          <div className={styles['footer-link-items']}>
            <h2>Social Media</h2>
            <Link to='/'>Instagram</Link>
            <Link to='/'>Facebook</Link>
            <Link to='/'>Youtube</Link>
            <Link to='/'>Twitter</Link>
          </div>
        </div>
      </div>
      <section className={styles['social-media']}>
        <div className={styles['social-media-wrap']}>
          <div className={styles['footer-logo']}>
            <Link to='/' className={styles['social-logo']}>
              리뷰킹 <i className='fab fa-typo3' />
            </Link>
          </div>
          <small className={styles['website-rights']}>리뷰킹 © 2025</small>
          <div className={styles['social-icons']}>
            <Link
              className={`${styles['social-icon-link']} facebook`}
              to='/'
              target='_blank'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </Link>
            <Link
              className={`${styles['social-icon-link']} instagram`}
              to='/'
              target='_blank'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </Link>
            <Link
              className={`${styles['social-icon-link']} youtube`}
              to='/'
              target='_blank'
              aria-label='Youtube'
            >
              <i className='fab fa-youtube' />
            </Link>
            <Link
              className={`${styles['social-icon-link']} twitter`}
              to='/'
              target='_blank'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </Link>
            <Link
              className={`${styles['social-icon-link']} linkedin`}
              to='/'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
