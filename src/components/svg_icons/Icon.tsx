import { Fragment } from 'react'

type SvgIconProps = {
    type : 'check' | 'answer',
    status : boolean
}

export function SvgIcon( {type , status} : SvgIconProps){
    const color = status ? '#835afd' : '#737380'

    return(
        <> 
        {
        type === 'answer' &&
        <svg
        width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" color={color}
            d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
            stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        }
        {
        type === 'check' &&
        <svg
        width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12.0003" cy="11.9998" r="9.00375" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" color={color}
            stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        }
        </>


    )
}