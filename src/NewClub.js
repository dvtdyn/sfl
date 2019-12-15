import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import uploadImg from './assets/icons/cloud-computing.svg'
import Button from './Button.js'
import add from './assets/icons/add.svg'
import remove from './assets/icons/remove.svg'
import axios from 'axios'

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUDNAME
const PRESET = process.env.REACT_APP_CLOUDINARY_PRESET

export default function NewClub() {
  const blankTeam = { teamName: '', league: '' }
  const [teams, setTeamsState] = useState([{ ...blankTeam }])
  const teamNameRef = useRef()

  const addTeam = () => {
    setTeamsState([...teams, { ...blankTeam }])
  }

  const removeTeam = () => {
    setTeamsState(teams.splice(0, teams.length - 1))
  }

  useEffect(() => {
    if (teams.length > 1) {
      teamNameRef.current && teamNameRef.current.focus()
    }
  }, [teams])

  const [image, setImage] = useState('')
  const [logo, setLogo] = useState('')
  const [loading, setLoading] = useState({
    imageLoading: false,
    logoLoading: false,
  })
  function upload(event) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDNAME}/upload`

    const formData = new FormData()
    const target = event.target
    let name = target.name
    formData.append('file', target.files[0])
    formData.append('upload_preset', PRESET)

    if (name === 'clubImage') {
      setLoading({ imageLoading: true })
    } else if (name === 'logo') {
      setLoading({ logoLoading: true })
    }

    axios
      .post(url, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
      .then(response => onImageSave(response, name))
      .catch(err => console.error(err))
  }

  function onImageSave(response, name) {
    if (name === 'clubImage') {
      setImage(response.data.secure_url)
      setLoading({ imageLoading: false })
    } else if (name === 'logo') {
      setLogo(response.data.secure_url)
      setLoading({ logoLoading: false })
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    const dbData = {
      ...data,
      clubImage: image,
      logo: logo,
    }
    console.log(dbData)
  }

  return (
    <NewClubForm onSubmit={handleSubmit}>
      <h1>DEIN VEREIN !</h1>
      <UploadWrapper>
        <Label className={image ? 'uploaded' : ''} htmlFor="clubimage">
          <UploadHeader
            style={
              loading.imageLoading || image
                ? { display: 'none' }
                : { display: 'block' }
            }
          >
            Vereinsfoto
          </UploadHeader>
          {loading.imageLoading ? (
            <UploadHeader>Loading...</UploadHeader>
          ) : (
            <img
              src={image ? image : uploadImg}
              className={image ? 'uploadedImg' : ''}
              alt=""
            />
          )}
        </Label>

        <NewClubInput
          type="file"
          id="clubimage"
          accept="image/*"
          name="clubImage"
          onChange={upload}
        />
        <Label htmlFor="logo" className={logo ? 'uploaded' : ''}>
          <UploadHeader
            style={
              loading.logoLoading || logo
                ? { display: 'none' }
                : { display: 'block' }
            }
          >
            Logo
          </UploadHeader>
          {loading.logoLoading ? (
            <UploadHeader>Loading...</UploadHeader>
          ) : (
            <img src={logo ? logo : uploadImg} alt="" />
          )}
        </Label>
        <NewClubInput
          type="file"
          id="logo"
          accept="image/*"
          name="logo"
          onChange={upload}
        />
      </UploadWrapper>
      <div>
        <FormHeader>Verein</FormHeader>
        <ClubWrapper>
          <NewClubInput type="text" name="clubName" placeholder="Vereinsname" />
          <NewClubInput type="text" name="phone" placeholder="Telefon" />
          <NewClubInput type="text" name="mail" placeholder="E-Mail" />
          <NewClubInput type="text" name="website" placeholder="Website" />
          <StreetNrWrapper>
            <NewClubInput type="text" name="street" placeholder="Straße" />
            <NewClubInput type="text" name="houseNumber" placeholder="Nr." />
          </StreetNrWrapper>
          <ZipCityWrapper>
            <NewClubInput type="text" name="zip" placeholder="PLZ" />
            <NewClubInput type="text" name="city" placeholder="Stadt" />
          </ZipCityWrapper>
        </ClubWrapper>
      </div>
      <div>
        <FormHeader>Teams</FormHeader>
        <Button name="Add" src={add} onClick={addTeam} />
        <Button name="Remove" src={remove} onClick={removeTeam} />
        {teams.map((val, index) => {
          const teamNameID = `teamName${index}`
          const leagueID = `league${index}`
          return (
            <TeamsContentWrapper key={teamNameID}>
              <NewClubInput
                type="text"
                name={teamNameID}
                ref={teams.length - 1 === index ? teamNameRef : null}
                placeholder="Teamname"
              />
              <NewClubInput type="text" name={leagueID} placeholder="Liga" />
            </TeamsContentWrapper>
          )
        })}
      </div>
      <NewClubInput type="submit" value="Submit" />
    </NewClubForm>
  )
}

const NewClubForm = styled.form`
  display: grid;
  gap: 10px;
  padding: 20px;
  h1 {
    justify-self: center;
    margin: 0;
    color: white;
    font-size: 2.8rem;
  }
`
const UploadWrapper = styled.div`
  display: grid;
  justify-content: space-evenly;
  grid-template-columns: 100px 100px;
`
const Label = styled.label`
  display: grid;
  grid-template-rows: 40px auto;
  justify-items: center;
  height: 100px;
  width: 100%;
  border: solid 1px white;
  border-radius: 20px;
  padding: 15px 10px;
  overflow: hidden;
  &.uploaded {
    background: white;
    padding: 0;
    grid-template-rows: auto;
    border: none;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    &.uploadedImg {
      object-fit: cover;
    }
  }
`

const UploadHeader = styled.h2`
  font-size: 1.6rem;
  color: white;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const FormHeader = styled.h2`
  font-size: 2.4rem;
  display: inline-block;
  color: white;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
const ClubWrapper = styled.div`
  display: grid;
  gap: 12px;
  padding-left: 8px;
`

const StreetNrWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: auto 60px;
`
const ZipCityWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 60px auto;
`

const TeamsContentWrapper = styled.div`
  display: grid;
  gap: 20px;
  padding-left: 8px;
  grid-template-columns: auto 120px;
`
const NewClubInput = styled.input`
  background-color: transparent;
  color: white;
  padding: 8px 8px 8px 0;
  font-size: 1.6rem;
  height: 40px;
  outline: none;
  display: block;
  border: none;
  border-bottom: 1px solid white;
  &[type='file'] {
    display: none;
  }

  &[type='submit'] {
    display: block;
    background: white;
    color: var(--dark);
    border-radius: 12px;
    margin: 0 auto;

    padding: 8px 20px;
    font-size: 2rem;
    height: 100%;
  }

  &::placeholder {
    font-size: 1.6rem;
    color: whitesmoke;
  }

  &:focus {
    border-color: lightsalmon;
  }
`
