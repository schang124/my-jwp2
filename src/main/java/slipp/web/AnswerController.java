package slipp.web;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import slipp.model.*;
import slipp.utils.HttpSessionUtils;

@RestController
@RequestMapping("/api/questions/{questionId}/answers")
public class AnswerController {
	@Autowired
	private QuestionRepository questionRepository;
	
	@Autowired
	private AnswerRepository answerRepository;


	@PostMapping("")
	public Answer create(@PathVariable Long questionId, String contents, HttpSession session){
		if(!HttpSessionUtils.isLoginUser(session)) {
			return new Answer();
		}

		User loginUser = HttpSessionUtils.getUserFromSession(session);
		Question question = questionRepository.findOne(questionId);
		Answer answer = new Answer(loginUser, question, contents);

		return answerRepository.save(answer);
	}

	@DeleteMapping("/{id}")
	public Result delete (@PathVariable Long questionId, @PathVariable Long id, HttpSession session) {
		if (!HttpSessionUtils.isLoginUser(session)) {
			return Result.fail("로그인 사용자만 답변쓰기가 가능합니다");
		}

		System.out.println("id : " + id);
		User loginUser = HttpSessionUtils.getUserFromSession(session);
		Answer answer = answerRepository.findOne(id);
		answer.delete(loginUser);
		answerRepository.save(answer);
		return Result.ok();
	}
}
