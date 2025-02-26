// 封装Message形式
export const formalMessage = (id, type, message, imageId) => {
	return {
		char: id,
		content: {
		  type: type,
		  message: message,
		  imageId: imageId
		}
	}
}


// 获取规范化的文件数据
export const getFomalData = (messages = [], systemPrompt = '') => {
	let chat_histories = [];
	
	// 如果有系统提示，添加到消息列表的开头
	if (systemPrompt) {
		chat_histories.push({
			'role': 'SYSTEM',
			'content': systemPrompt
		});
	}
	
	messages.forEach((mes) => {
		let content;
		if(mes.content.type == 'Image'){
			content = [
			{
				'type': 'text',
				'text': '请简单总结一下？'
			},
			{
				'type': 'image_url',
				'image_url': {
					'url' : mes.content.imageId
				}
			}
			];
		}else if(mes.content.type == 'Text')
			content = mes.content.message
			
		// 根据角色设置正确的role值
		let role;
		if (mes.char === 'USER') {
			role = 'USER';
		} else if (mes.char === 'ASSISTANT') {
			role = 'ASSISTANT';
		} else {
			role = mes.char.toLowerCase();
		}
		
		const newMes = {
			'role': role,
			'content': content
		};
		chat_histories.push(newMes);
	})
	
	// 规范化data
	const data = {
				"model": "MiniCPM-V-2.6",
				"messages": chat_histories,
				"stream": false,
				"temperature": 0.7
			}
	console.log(data);
	return data
}

// 获得规范化的Data数据
// export const getFomalData = (messages = []) => {
//    // 规范化data中的message变量
//    let chat_histories = [];
// 	messages.forEach((mes) => {

// 		const newMes = {
// 			'role' : mes.char == 'USER' ? 'user' : 'system',
// 			'content' : mes.content.message
// 		};
// 		chat_histories.push(newMes);
// 	})
// 	console.log("形成的messages：" + chat_histories);
	
// 	// 规范化data
// 	const data = {
// 					"model": "MiniCPM-V-2.6",
// 					"messages": chat_histories,
// 					"stream": false,
// 					"temperature": 0.7
// 				}
// 	return data
// }