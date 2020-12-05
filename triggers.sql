DELIMITER $$

CREATE TRIGGER must_be_adult
     BEFORE INSERT ON users FOR EACH ROW
     BEGIN
          IF NEW.age < 18
          THEN
              SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Must be an adult!';
          END IF;
     END;
$$

INSERT INTO users (usersname, age) VALUES ('Rizwan Memon', 10)



DELIMITER $$

CREATE TRIGGER example_cannot_follow_self
     BEFORE INSERT ON follows FOR EACH ROW
     BEGIN
          IF NEW.follower_id = NEW.followee_id
          THEN
               SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot follow yourself, silly';
          END IF;
     END;
$$

-- throws error
INSERT INTO follows(follower_id, followee_id) VALUES(5,5)
-- works
INSERT INTO follows(follower_id, followee_id) VALUES(7,2)



-- DELIMITER $$

-- CREATE TRIGGER create_unfollow
--     AFTER DELETE ON follows FOR EACH ROW 
-- BEGIN
--     INSERT INTO unfollows
--     SET follower_id = OLD.follower_id,
--         followee_id = OLD.followee_id;
-- END$$