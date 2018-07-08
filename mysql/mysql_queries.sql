/*
*  HOMEWORK 08 - SQL  
*
*  Database - Sakila 
*/

-- Use 'Sakila' Database
USE Sakila;

-- 1a. Display the first and last names of all actors from the table actor.
SELECT first_name, last_name
FROM actor;
    
-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT UPPER(CONCAT_WS('  ', first_name, last_name)) AS 'Actor Name'
FROM actor;
    
-- 2a. Find the ID number, first name, and last name of an actor, whose first name is "Joe".
SELECT actor_id, first_name, last_name
FROM actor a
WHERE a.first_name = 'Joe';
    
-- 2b. Find all actors whose last name contain the letters GEN.
SELECT *
FROM actor
WHERE last_name REGEXP 'GEN';

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT *
FROM actor
WHERE last_name REGEXP 'LI'
ORDER BY last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
SELECT country_id, country
FROM country
WHERE country IN ('Afghanistan' , 'Bangladesh', 'China');
    
-- 3a. Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
ALTER TABLE actor 
ADD COLUMN middle_name VARCHAR(45) 
AFTER first_name;

-- 3b. You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
ALTER TABLE actor
MODIFY COLUMN middle_name BLOB;

-- 3c. Now delete the middle_name column.
ALTER TABLE actor 
DROP COLUMN middle_name;

-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(last_name) AS 'Number of Actors'
FROM actor
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT last_name, COUNT(last_name) AS frequency
FROM actor
GROUP BY last_name
HAVING frequency > 1;

-- 4c.The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
UPDATE actor 
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';

-- 4d. In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. 
--     Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. 
UPDATE actor
SET first_name  = 
( 
	CASE WHEN first_name = 'HARPO' THEN 'GROUCHO'
	ELSE 'MUCHO GROUCHO'
    END
)     
WHERE 
	actor_id = 172;


-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT 
    s.first_name AS 'First Name',
    s.last_name AS 'Last Name',
    m.address AS 'Address'
FROM
    staff s
        INNER JOIN
    address m USING (address_id);
    
-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT 
    s.staff_id AS 'Staff Id', 
    CONCAT(s.first_name, ' ', s.last_name) AS 'Staff Name',
    SUM(p.amount) AS 'Total Amount'
FROM
    staff s
        INNER JOIN
    payment p USING (staff_id)
WHERE MONTH(p.payment_date) = '08' AND YEAR(p.payment_date) = '2005'
GROUP BY (s.staff_id);

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT 
	f.film_id AS 'Film Id',
    f.title AS 'Title',
    COUNT(fa.actor_id) AS 'Number of Actors Acted'
FROM
    film f
        INNER JOIN
    film_actor fa USING (film_id)
GROUP BY f.film_id, f.title
ORDER BY f.film_id;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT 
    f.title AS film_title,
    (SELECT COUNT(*)
		FROM inventory inv
		WHERE f.film_id = inv.film_id) AS 'Number of Copies'
FROM
    film f
HAVING f.title = 'Hunchback Impossible';

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
-- 	![Total amount paid](Images/total_payment.png)

SELECT c.first_name AS 'First Name',
	   c.last_name AS 'Last Name',
       sum(p.amount) AS 'Total Amount Paid'
FROM payment p
JOIN customer c 
USING(customer_id)
GROUP BY c.first_name, c.last_name 
ORDER BY c.last_name;

-- 7a. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT  f.title
FROM film f
WHERE title REGEXP ("^K|^Q") AND language_id IN(
										SELECT language_id 
                                        FROM language
                                        WHERE name="English");
									
-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
SELECT a.actor_id, a.first_name AS 'First Name',
       a.last_name AS 'Last Name'
FROM actor a 
WHERE a.actor_id IN (SELECT fa.actor_id 
					 FROM film_actor fa
                     WHERE fa.film_id IN (SELECT f.film_id
										  FROM film f
									   	  WHERE f.title = "Alone Trip"));
                                          
-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.

SELECT cu.first_name AS 'First Name',
	   cu.last_name AS 'Last Name',
       cu.email AS 'Email'
FROM customer cu
JOIN address a ON cu.address_id = a.address_id
JOIN city c ON a.city_id = c.city_id
JOIN country co ON c.country_id = co.country_id
WHERE co.country = "Canada"
ORDER BY cu.first_name;

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as famiy films.
-- Option 1: Solution
SELECT f.title AS 'Title'       
FROM film f
JOIN film_category fc ON f.film_id = fc.film_id
JOIN category c ON fc.category_id = c.category_id
WHERE c.name = "Family";

-- Option 2: Solution
SELECT f.title AS 'Title'     
FROM film f 
WHERE f.film_id IN (SELECT fc.film_id 
					FROM film_category fc
                    WHERE fc.category_id IN (SELECT category_id 
											 FROM category
											 WHERE name = "Family"));
                                                                                     
-- 7e. Display the most frequently rented movies in descending order.
SELECT f.title, COUNT(r.rental_id) AS 'Number of rentals'
FROM film f
JOIN inventory inv ON f.film_id = inv.film_id
JOIN rental r ON r.inventory_id = inv.inventory_id
GROUP BY f.title
ORDER BY COUNT(r.rental_id) DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
-- Solution1
select * from sales_by_store;

-- Solution2
SELECT st.store_id AS 'Store Id',
	   CONCAT(c.city, ', ', co.country) AS 'Address',
	   SUM(p.amount) AS 'Total Sales in Dollars'
FROM payment p
JOIN staff f USING(staff_id)
JOIN store st USING(store_id)
JOIN address a ON st.address_id = a.address_id
JOIN city c USING(city_id)
JOIN country co USING(country_id)
GROUP BY st.store_id
ORDER BY st.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT s.store_id AS 'Store Id', 
	   c.city AS 'City',
       co.country AS 'Country'       
FROM store s
JOIN address a USING(address_id)
JOIN city c USING(city_id)
JOIN country co USING(country_id);

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT c.name AS'Genre',
       SUM(p.amount) AS 'Total Gross Revenue'
FROM payment p
JOIN rental r USING(rental_id)
JOIN inventory inv USING(inventory_id)
JOIN film_category fc USING(film_id)
JOIN category c USING(category_id)
GROUP BY c.category_id
ORDER BY SUM(p.amount) DESC
LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view.
DROP VIEW IF EXISTS top_five_genres_by_gross_revenue;

CREATE VIEW top_five_genres_by_gross_revenue AS
    SELECT 
        c.name AS 'Genre', SUM(p.amount) AS 'Total Gross Revenue'
    FROM
        payment p
            JOIN
        rental r USING (rental_id)
            JOIN
        inventory inv USING (inventory_id)
            JOIN
        film_category fc USING (film_id)
            JOIN
        category c USING (category_id)
    GROUP BY c.category_id
	ORDER BY SUM(p.amount) DESC
	LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM top_five_genres_by_gross_revenue;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW top_five_genres_by_gross_revenue;
