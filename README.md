# OCR-based-assistant-system

1. Core Features
2. Benefits
3. UI Showcase
4. Example Use Cases
5. User Guide  
   5.1 ‘Home’ page  
   5.1.1 Upload images  
   5.1.2 Custom Design Strategies  
   5.1.3 View and get results  
   5.2 ‘User Centre’ page  
   5.2.1 Sign in  
   5.2.2 Historical strategies and orders viewing and sharing and other's sharing viewing  
6. Tech Stack  
--------------------------------------------------------------------------------------------------
1. Core Features  
The system is designed for bulk character recognition, dynamically adapting its recognition strategy to accurately identify desired characters in images.

2. Benefits  
The system employs multiple strategies, allowing it to handle a wider range of character recognition scenarios compared to using a single approach.

3. UI Showcase  
View attached documents.

4. Example Use Cases  
View attached documents.

5. User Guide  

5.1 ‘Home’ page

5.1.1 Upload images
1. Click to upload a sample image, the sample image displays a thumbnail, click on the thumbnail to view a normal-sized image.
2. Click the Preview button to see this example image of a circled character box.
3. Click to select the remaining images, the image thumbnail queue display, click the thumbnail to view the normal proportion of the image, click the upload button to upload the remaining images
4. Click the Hide button to hide the thumbnail queue, and click it again to restore the thumbnail queue.

5.1.2 Custom Design Strategies
1. It's optional. Click on the ‘Use Historical Strategies’ button to jump to the Historical Strategies page, select an item from the list and you will be returned to this page and the Strategies will be added to the strategy cards.
2. Click on the ‘+’ sign to add a strategy card, and click on the ‘x’ symbol in the upper right corner of the strategy card to delete it.
3. Select a method of positioning and fill in the information required for that method.  
   a. Character based position, this card will find all character boxes in the picture at that location based on the location of the selected point. Information on the position of the point is required, including the distance from the left border of the picture to the point, and the distance from the top border of the picture to the point, in either percentage or physical pixels.  
   b. Regular expression matching, this card will find all the character boxes in the picture that contain that character, based on the character provided. The desired character is required.  
   c. Position between characters, this card will find the desired character box based on the character box determined by the previous card and the position determined by moving a few character size positions away from that character box. The position determined is where the right border of that character box is moved horizontally towards the right and the lower border is moved vertically towards the bottom by several average character size in the character box positions. The card serial number of the character box identified by one of the previous cards needs to be provided, as well as the character number between the character box and the desired position.  
4. The previous step has determined which character box to find. At the row and column merge step, regional character merging that varies with character size is supported. Selects whether to merge characters in a region. Provide the number of average character distances by which the left and right borders of the character box are moved to the right, and the number of average character distances by which the lower and upper borders of the character box are moved down.
5. Select whether to add characters, delete characters, modify characters of the character box, click the ‘Add’ button to select one of the operations, add a piece of the box,  
   a. To add characters, you need to provide the characters found under the previous operation of the character box in front of or behind the character, add the character.  
   b. To delete characters, you need to provide the characters to be deleted.  
   c. To modify characters, you need to provide the characters to be modified, as well as the modified characters.  
   When you click ‘Collapse’, all the added character boxes will be hidden, and when you click again, they will be expanded.  
7. Click the ‘Upload’ button to upload the strategy cards and click the ‘Save’ button to store the strategy cards in the Historical strategies.
8. Click the ‘Clear Strategy’ button, and the strategy had written will be deleted.

5.1.3 View and get results
1. Click the ‘Results’ button to display the recognised characters and save the sample image, strategies and recognised characters as an order in the historical orders and save the strategies in the historical strategies.
2. Click the ‘Save Result’ button to save the recognised characters in txt form, which can be opened directly in Excel.

5.2 ‘User Centre’ page

5.2.1 Sign in  
1. Click the ‘Login’ button, you will get the unique account number of the WeChat account, and the system will get the WeChat nickname and avatar of the WeChat account after obtaining the authorisation of the user, and display it.  

5.2.2 Historical strategies and orders viewing and sharing and other's sharing viewing  
1. Click ‘Historical Orders’ to display all the orders of the account, and click one of the orders to display the specific information of the order.  
2. Click ‘Historical Strategies’ to display all the strategies of the account, and click one of the strategies to display the specific information of the strategy.  
3. Click ‘Share Orders and Strategies’ to display several random shares from other people, click ‘Share’ button, choose to share strategies or share orders, display all strategies or display all orders, select a strategy or order to share, or click a strategy or order and then share the strategy or order, click one of the strategies to display the specific information of the strategies, or click one of the orders to display the specific information of the order, enter the characters in the search box, and select Search User, Search Strategy Name, Search Order Name, or Search Publishing Time, it will display all the strategies and orders shared by others in the search, and click one of the strategies or orders to view the specific information of the strategy or order.
-
6. Tech Stack  
Use WXML, WXSS, JavaScript(a specific HTML, CSS frame, and a specific JavaScript) to render the front-end, use Python to calculate, use Flask for messaging front-end and back-end, use MySQL to store and query data, use open-source technology OCR to recognise characters.  
