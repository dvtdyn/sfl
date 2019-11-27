import React from 'react'
import Club from './Club'
import clubs from './clubs'
import styled from 'styled-components/macro'
import GlobalStyles from './GlobalStyles'

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Grid>
        {clubs.map(({ logo, name, websiteURL, websiteName, _id }) => (
          <Club
            key={_id}
            logo={logo}
            clubName={name}
            websiteURL={websiteURL}
            websiteName={websiteName}
          />
        ))}
      </Grid>
    </>
  )
}

const Grid = styled.section`
  display: grid;
  margin: 20px 15px;
  justify-content: center;
  gap: 20px;
`
