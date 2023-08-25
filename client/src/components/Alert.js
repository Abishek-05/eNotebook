import React from 'react'

const Alert = (props) => {
  return (
	<div>
		<div style={{height : "50px"}}>
		{ //since we check props.alert(condn), we have to enclose everything in {} only then we can wrap it in a div
			props.alert && 
			<div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
				<strong>{props.alert.msg}</strong>
			</div>
		}
		</div>
	</div>
  )
}

export default Alert
