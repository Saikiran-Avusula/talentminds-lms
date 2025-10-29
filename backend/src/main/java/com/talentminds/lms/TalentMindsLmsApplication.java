package com.talentminds.lms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TalentMindsLmsApplication {

	private static final Logger log = LoggerFactory.getLogger(TalentMindsLmsApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(TalentMindsLmsApplication.class, args);
		log.info("TalentMinds LMS App is running successfully....!");
	}

}
