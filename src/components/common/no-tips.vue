<script>
	 export default{
	 	name:'notips',
	 	props:{
	 		notips:{
	 			type:String
	 		}
	 	}
	 }
</script>

<template>
	<div class="no-content" :class="notips"></div>
</template>