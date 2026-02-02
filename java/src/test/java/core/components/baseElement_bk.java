/*
package core.components;

import configuration.DriverConfig.ApplicationDriver;
import custom_Func.Custom_Func;
import dataReader.GlobalConfigsReader;
import org.junit.jupiter.api.Assertions;;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

public class baseElement2 {

	private WebElement webElement;

	private ApplicationDriver appDriver;

	public baseElement2(ApplicationDriver appDriver) {
		// TODO Auto-generated constructor stub
		this.appDriver = appDriver;
	}
	
	public  WebElement Page_title() {
		  return GetElement(Page_Title_xpath);
		 }
	
	public  WebElement TinyIframe(String xpath){
		return GetElement(xpath);
	}

	public  WebDriver SwitchIframe_func(WebElement element) {
		
		//***NOTE: element = null | WebElement
		WebDriver driver = null;

		*/
/*if(element!=null)
		{
			driver = appDriver.GetDriver().switchTo().frame(element);
		}
			
		
		else
			driver = appDriver.GetDriver().switchTo().parentFrame();
			//webDriver.switchTo().defaultContent();

		return appDriver.GetDriver();//DriverFactory.changeWebDriver(webDriver)*//*

				
		if(element!=null)
		{
			driver = appDriver.getDriver().switchTo().frame(element);
		}

		else
			driver = appDriver.getDriver().switchTo().parentFrame();
		//webDriver.switchTo().defaultContent();

		 return driver;//DriverFactory.changeWebDriver(webDriver)
	}	
	
	
public  List<WebElement> GetElements(String elements_xpath) {
		
		try{
		
			List<WebElement> temp_element = appDriver.getDriver().findElements(By.xpath(elements_xpath));
			return temp_element;
		}
		catch(NoSuchElementException e) {
			return null;
		}
	}



public  WebElement GetElement(String element_xpath)
{
	
	System.out.println("...Impliciate Waiting for the element "+ element_xpath);
	appDriver.getDriver().manage().timeouts().implicitlyWait(GlobalConfigsReader.glb_WaitTime-2, TimeUnit.SECONDS);
	
	try{
		WebDriver webDriver = appDriver.getDriver();
		
		WebElement temp_element = webDriver.findElement(By.xpath(element_xpath));
		
		return temp_element;
	}
	catch(NoSuchElementException e) {
		return null;
	}
}


public  WebElement Page_TinyContentBox()
{
	try{
		WebElement iframe_e = TinyIframe(Page_TinyIframe_xpath);
		
		WebDriver webDriver = SwitchIframe_func(iframe_e);

		WebElement temp_element = webDriver.findElement(By.xpath(Content_txt_xpath));
		//((JavascriptExecutor) webDriver).executeScript("arguments[0].scrollIntoView(true);", temp_element);
		
		return temp_element;
	}
	catch(NoSuchElementException e) {
		return null;
	}
}

public  WebElement Modal_TinyContentBox()
{
	try{
		WebElement iframe_e = TinyIframe(Modal_TinyIframe_xpath);
		
		WebDriver webDriver = SwitchIframe_func(iframe_e);

		WebElement temp_element = webDriver.findElement(By.xpath(Content_txt_xpath));
		//((JavascriptExecutor) webDriver).executeScript("arguments[0].scrollIntoView(true);", temp_element);
		
		return temp_element;
	}
	catch(NoSuchElementException e) {
		return null;
	}
}
		


//METHODS

public  boolean Is_Field_Display(WebElement element)
{
	if(element!=null)
	{
		String text = element.getAttribute("disabled");
		
		if(text==null ||text.equals("false") )
		{
			return true;
		}//if text!=null
	}//if element!=null
	
	return false;
}
public  void ClearThenEnterValueToField(WebElement field_txt, String value)
{
	
	try
	{
		field_txt.clear();
		
		Thread.sleep(1000);
		
		field_txt.sendKeys(value);
		
		appDriver.driver =  SwitchIframe_func(null);
		
*/
/*
		String value_tmp = GetFieldText_func(field_txt);
		
		if(!value_tmp.equals(value))
		{
			Optimize_ElementSendkey(field_txt, value);
		}//end if
*//*

		
	
	}catch (NullPointerException | InterruptedException e)
	{
		GlobalConfigsReader.glb_TCFailedMessage+="Field is not displayed: "+e.getMessage();
		Assert.assertFalse(GlobalConfigsReader.glb_TCFailedMessage,true);
	}//end catch
	
}
	


public  void VerifyFieldValidation_func(String fieldname_str, WebElement element_temp,String input_str, String Expected_msg, String note) {
	if (Expected_msg.equals("")) {
		if (element_temp == null || element_temp.getText().equals("")) {
			GlobalConfigsReader.glb_TCStatus = false;

			GlobalConfigsReader.glb_TCFailedMessage += "[Input: "+input_str+"]Validation message does not displays.\n";
		}

		else {
			VerifyFieldValueEqual_func(fieldname_str, element_temp, Expected_msg,note);
		}
	}
	else {
		if (element_temp != null && !element_temp.getText().equals("")) {
			GlobalConfigsReader.glb_TCStatus = false;

			GlobalConfigsReader.glb_TCFailedMessage += "[Input: "+input_str+"]"+fieldname_str+ "Validation message should not display.\n";
		}
	}
}//end void


public  void VerifyFieldDisplayed_func(String fieldname_str,WebElement element,String note)
{

	if(element==null)
	{
		GlobalConfigsReader.glb_TCStatus = false;
		GlobalConfigsReader.glb_TCFailedMessage += "The "+fieldname_str+" Should Displayed "+ note+".";
	}

	*/
/*
	 else if(!element.isDisplayed())
	 {
	 TestConfigs.glb_TCStatus = false;
	 TestConfigs.glb_TCFailedMessage += "The "+fieldname_str+" Should Displayed "+ note+"."
	 }
	 *//*

}//end void

public  void VerifyFieldNotDisplayed_func(String fieldname_str,WebElement element,String note)
{

	if(element!=null && element.isDisplayed())
	{
		GlobalConfigsReader.glb_TCStatus = false;
		GlobalConfigsReader.glb_TCFailedMessage += "The "+fieldname_str+" Should NOT Displayed "+ note+".";
	}
}//end void


//VALUE VERIFY METHOD - COMPARE VALUE ATTRIBUTE OF ELEMENT TO EXPECTED VALUE
public  void VerifyFieldValueEqual_func(String fieldname_str, WebElement element_temp,String expected_str,String note_str) {
	
	try
	{
		String observed = "";
		 observed = GetFieldText_func(element_temp);
		
		System.out.println("Value is: " + observed);
		
		if(expected_str.equals("") || expected_str.equals("0.00")|| expected_str.equals("$0.00"))
		{
			expected_str = "";
			if(observed.equals(" -")||observed.equals("-"))
				observed = "";
		}
		
		if(!observed.equals(expected_str)) {
			GlobalConfigsReader.glb_TCStatus = false;
			GlobalConfigsReader.glb_TCFailedMessage += fieldname_str+" Value Must EQUAL.[Observed:"+observed+"- Expected:"+expected_str+"] "+note_str+"\n";
		}
	
	}catch(NullPointerException e)
	{
		GlobalConfigsReader.glb_TCFailedMessage += fieldname_str +" is not available.\n";
		Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
		
	}

}//end void


//Negative Verification method - COMPARE NOT EQUAL OF ELEMENT VALUE AND EXPECTED VALUE
public  void VerifyFieldValueNotEqual_func(String fieldname_str, WebElement element_temp,String expected_str,String note_str) {
	
	String observed = GetFieldText_func(element_temp);
	
	System.out.println(observed);

	if(observed.equals(expected_str)) {
		GlobalConfigsReader.glb_TCStatus = false;

		GlobalConfigsReader.glb_TCFailedMessage += fieldname_str+"Value Must NOT Be EQUAL.[Observed: "+observed+"- Expected:"+expected_str+"] "+note_str+".";
	}
}//end void


public  List<String> GetTableRecordsPerPaging_func(WebElement TableElement) {
		List<WebElement> rows_table = null;
		
		WebElement table = TableElement;
		
		List<String > list;
		//'To locate rows of table it will Capture all the rows available in the table'
	
		rows_table = table.findElements(By.tagName("tr"));
	
		int rows_count = rows_table.size();
	
		System.out.println(rows_table.size());
		if(rows_count==0) {
		return null;
		}

		//for per one row
		list = new ArrayList<>();
		
		for (WebElement cur_row :rows_table) {
			//'To locate columns(cells) of that specific row'
			List<WebElement> Columns_row = cur_row.findElements(By.tagName("td"));

			String cur_record ="";
		
			for(WebElement cur_col :Columns_row)
			{
				cur_record+=cur_col.getText()+"|";
				
			}//end for column
			
			System.out.println(cur_record);
			
			list.add(cur_record);

		}//end for get row record

		//==add records to total list array
		return list;
	
	
}//end void

public  void FilterTableRecord_func(WebElement Filter_txt,WebElement submit_btn,String input_str){
	WebElement textfield = Filter_txt;
	WebElement submit = submit_btn;

	String input_temp = input_str;

	textfield.sendKeys(input_temp);

	if(submit!=null)
	{
		submit.click();
	}
	
}//end void


//METHOD:
public  void wait_For_PageLoad()
{
	
	
	appDriver.getDriver().manage().timeouts().implicitlyWait(GlobalConfigsReader.glb_WaitTime*2, TimeUnit.SECONDS);
	
	
	ExpectedCondition<Boolean> pageLoadCondition = new
			ExpectedCondition<Boolean>() {
				public Boolean apply(WebDriver driver_temp) {
					return ((JavascriptExecutor)driver_temp).executeScript("return document.readyState").equals("complete");
				}
			};
	WebDriverWait wait = new WebDriverWait(appDriver.getDriver(), GlobalConfigsReader.glb_WaitTime*3);
	wait.until(pageLoadCondition);
	

	
}//end void


//METHOD
public  void Wait_For_ElementDisplay(String element_xpath) {

		
	
		WebDriverWait wait = new WebDriverWait(appDriver.getDriver(),GlobalConfigsReader.glb_WaitTime*5);

		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(element_xpath)));	
		
	//	wait.until(elementIdentified.)
		
	
	}//end void




//=====TO HANDLE CLICK ACTION IN SOME SPECIAL CASE ELEMENT CANNOT BE CLICK NORMALY THROUGH THE SELENIUM METHOD



public  void Optimize_ElementSendkey(WebElement element,String input_str)
{
	

	try{
		
		if(!input_str.equals(""))
		{
			WebDriver webDriver = appDriver.getDriver();
			
			Actions actions = new Actions(webDriver);
								
			Thread.sleep(1000);
			
			Action action;
			//for(int i =0;i<10;i++)
			//{
			//	action = actions.doubleClick(element).sendKeys(Keys.BACK_SPACE).keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).build();
			
			if(Custom_Func.GetOS_func().contains("mac"))
			{
				//***NOTE: Work Arround for MAC - Chrome: Keys.Command doesn't work as Known issue of selelium
				//ClearThenEnterValueToField(element, input_str);
				
				Optimize_ElementClick(element);
				Thread.sleep(1000);			
				action = actions.sendKeys(Keys.ARROW_DOWN).build();
				action.perform();	
				
				for(int i=0;i<100;i++)
				{
					action = actions.sendKeys(Keys.BACK_SPACE).build();
					action.perform();	
				}
				
			
				//action = actions.keyDown(Keys.COMMAND).sendKeys("a").keyUp(Keys.COMMAND).sendKeys(Keys.DELETE).build();
				
				//action = actions.sendKeys(Keys.HOME).keyDown(Keys.LEFT_SHIFT).keyDown(Keys.CONTROL).sendKeys(Keys.ARROW_RIGHT).keyUp(Keys.CONTROL).keyUp(Keys.LEFT_SHIFT).sendKeys(Keys.DELETE).build();
				
				//action.perform();
				
						
			}
			else
			{
				
				Optimize_ElementClick(element);
				
				Thread.sleep(1000);
				
				action = actions.sendKeys(Keys.ARROW_RIGHT).build();
				
				action.perform();
				
				action = actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).sendKeys(Keys.DELETE).build();
				
				action.perform();
				
				//Thread.sleep(2000);
						
			}//end else
				
			action = actions.sendKeys(element,input_str).build();
			
			action.perform();
			
			appDriver.driver = SwitchIframe_func(null);
			
		}//end if !input_str.equals("")
		
		
	}//and try
	catch(InterruptedException e) 
	{
		e.printStackTrace();
	}


}//end void



public  void Verify_Field_Editable_func(String fieldname, WebElement e,String value_str,String note)
{
	Boolean status = Is_Field_Editable_func(e,value_str);

	if(!status)
	{
		GlobalConfigsReader.glb_TCStatus = false;
		GlobalConfigsReader.glb_TCFailedMessage += fieldname+" SHOULD EDITABLE "+note+".";
	}

}//end void

public  void Verify_Field_Not_Editable_func(String fieldname, WebElement e,String value_str,String note)
{
	//Boolean status = IsEdit_mode_Field_Editable_func(e,value_str);
	Boolean status = Is_Field_Editable_func(e,value_str);
	
	if(status==true)
	{
		GlobalConfigsReader.glb_TCStatus = false;
		GlobalConfigsReader.glb_TCFailedMessage += fieldname+" SHOULD NOT EDITABLE "+note+".\n";
	}

}//end void



private  void SelectItemULElement_func(WebElement ul_element,String item_text,String note)
{
	try {
	
			List<WebElement> item_list = null;
			WebElement dropdown = ul_element;
			//'To locate rows of table it will Capture all the rows available in the table'
		
			Thread.sleep(2000);
			
			item_list = dropdown.findElements(By.tagName("li"));
		
			int rows_count = item_list.size();
		
			//System.out.println(item_list.size())
			if(rows_count==0) {
		
				GlobalConfigsReader.glb_TCFailedMessage += "No item in the dropdown - "+note+"\n";
				Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
				
			}
			
			//for per one item
			Boolean exist = false;
			Thread.sleep(2000);
			for(int index = 0; index <rows_count;index++)
			{
				WebElement option = item_list.get(index);
		
				String text = option.getText();
				System.out.println("Item ="+text);
				if(text.contains(item_text))
				{
					exist = true;
					Optimize_ElementClick(option);
				//	option.click();
					Thread.sleep(2000);
					
					break;
		
				}
		
			}//end for
		
			if(!exist)
			{
				GlobalConfigsReader.glb_TCFailedMessage += "Unfound item["+item_text+"] in the dropdown.\n";
				Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
			}
	
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}

}//end void

public  void Wait_Ultil_ElementNotDisplay(String element_xpath)
{
	try {
		
		WebElement element_tmp = GetElement(element_xpath);
		
		if(element_tmp!=null)
		{
			System.out.println("Wait For the Element["+element_tmp.toString()+"] Not Displayed.\n");
			
			WebDriverWait wait = new WebDriverWait(appDriver.getDriver(),GlobalConfigsReader.glb_WaitTime);

			wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(element_xpath)));
		
		
		}
		
	} catch(TimeoutException e)
	{
		e.printStackTrace();
	}
	
}//end void

public  void Wait_For_ElementEnable(WebElement element)
{
	if(element!=null)
		for(int i = 0;i<20;i++)
	{
		if(element.isEnabled())
		{
			break;
		}
		try {
			Thread.sleep(GlobalConfigsReader.glb_WaitTime*1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//end catch
	}//end for


	//wait.until(ExpectedConditions.not(ExpectedConditions.))
}//end void



public  void EnterValueToTextField(WebElement element, String value) {

	try{
		element.clear();
		element.sendKeys(value);
	}

	catch(Exception e)
	{
		ScrollElementtoViewPort_func(element);

		element.clear();
		element.sendKeys(value);
	}

}//end void



//SELECT ITEM FROM DROPDOWN ELEMENTS
public  void SelectDropdownItem(WebElement element,String item_text,String note_str)
{
	try{
		String tag_name = element.getTagName();
		
		System.out.println("Dropdown tag type:"+tag_name);
		
		String compare_tag = "ul";
		
		if(tag_name.equals(compare_tag))
		{
			SelectItemULElement_func(element, item_text,note_str);
		}
			
		else
		{
			Optimize_ElementClick(element);
			Thread.sleep(300);
			Select slect_e = new Select(element);
			
			slect_e.selectByVisibleText(item_text);
			
			Optimize_ElementClick(element);
			
		//slect_e.selectByValue("526")
		//	Thread.sleep(1000);
		}//end else
		
	}catch(NoSuchElementException | InterruptedException e)
	{
		GlobalConfigsReader.glb_TCFailedMessage+=e.getMessage()+".\n";
		Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
		
	}
	


}//end void


public  void selectRandomItemDropdown( WebElement dropdown, List<WebElement> itemsInDropdown){
	dropdown.click();

	try {
		Thread.sleep(1000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}

	int size = itemsInDropdown.size();
	
	int randomNumber = ThreadLocalRandom.current().nextInt(0, size);
	System.out.println("Random item in the dropdown:" + randomNumber);

	itemsInDropdown.get(randomNumber).click();
}//end void



public  int countRowInTable(List<WebElement> rowsTable) {
	System.out.println(rowsTable.size());
	return rowsTable.size();
	
}//end void



//METHOD: TO VERIFY ITEM MUST EXIST IN THE DROPDOWN
public  void VerifyItemExistDropdown(WebElement element,String item_text)
{
	//for per one item
	Boolean exist = IsItemExisDropdown(element,item_text);

	System.out.println("IsExist = "+exist);
	if(exist==false)
	{
		GlobalConfigsReader.glb_TCStatus =false;
		GlobalConfigsReader.glb_TCFailedMessage += "Unfound item["+item_text+"] in the dropdown.\n";
	}

}//end void



//METHOD: TO VERIFY ITEM MUST NOT EXIST IN THE DROPDOWN
public  void VerifyItemNotExistDropdown(WebElement element,String item_text)
{
	//for per one item
	Boolean exist = IsItemExisDropdown(element,item_text);


	if(exist==true)
	{
		GlobalConfigsReader.glb_TCStatus =false;
		GlobalConfigsReader.glb_TCFailedMessage += "Item["+item_text+"] SHOULD NOT in the dropdown.\n";
	}

}//end void


public  List<WebElement> Get_Row_Item_Table_func(WebElement table)
{
	List<WebElement> Row_list = table.findElements(By.tagName("tr"));
	return Row_list;
	
}

public  String Precondition_Get_First_Data_Table_func(WebElement table)
{
	List<WebElement> Row_list = Get_Row_Item_Table_func(table);
	String return_str = Row_list.get(0).findElement(By.tagName("span")).getText();
	return return_str;
}


//GET ELEMENT FROM TABLE
public  WebElement GetElementInTable(String searchvlue,WebElement table, String element_xpath)
{
	try{

		String xpath = "//td[contains(.,'"+searchvlue+"')]/.."+element_xpath;
		System.out.println(xpath);
		
		return table.findElement(By.xpath(xpath));

	}//try
	catch(NoSuchElementException e) {
		return null;
	}
	
	
}//end void



//========VERIFY ITEM EXIST IN TABLE

public  boolean IsItemExistTable(WebElement table,String item_name)
{
	Boolean exist = false;

	List<String> result = GetTableRecordsPerPaging_func(table);

	for(int i = 0;i<result.size();i++)
	{
		if(result.get(i).contains(item_name))
		{
			exist = true;
			break;
		}
	}//end for


	return exist;

}//end void



//=============CHECK ITEM IS EXIST IN DROPDOWN
public  boolean IsItemExisDropdown(WebElement dropdown_e,String item_name)
{
	Boolean exist = false;
	WebElement dropdown = dropdown_e;

	List<WebElement> item_list = null;


	try {
		Thread.sleep(1000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
	if(dropdown.getTagName().equals("ul"))
	{
		item_list = dropdown.findElements(By.tagName("li"));

	}//end if tagname = ul

	else if(dropdown.getTagName().equals("select"))
	{
		item_list = dropdown.findElements(By.tagName("option"));
	}

	///==================VERIFY SCRIPTS

	int rows_count = item_list.size();

	System.out.println(item_list.size());
	System.out.println(item_name);

	if(rows_count!=0) {

		for(int index = 0; index <rows_count;index++)
		{
			WebElement option = item_list.get(index);

			String text = option.getText();
			System.out.println("Item ="+text);
			if(text.equals(item_name))
			{
				exist = true;
				break;

			}//end if

		}//end for

	}//end if

	return exist;
}





//METHOD: TO GET TEST ATTRIBUTE OF THE FIELD
public  List<WebElement> Get_Dropdown_ItemsElement_func(WebElement element)
{
	List<WebElement> items= new ArrayList<WebElement>();
	
	String tagname_str = element.getTagName();
	
	switch(tagname_str)
	{
	case "select":
		
			Select e_tmp = new Select(element);
			
			items = e_tmp.getOptions();
	
	}
	
	return items;
}


public  String GetFieldText_func(WebElement element)
{
	
	
	String observed="";
		
	//Wait_For_ElementDisplay(element);
	WebElement element_tmp =element;
	
	String tagname_str = element_tmp.getTagName();
	
	Boolean Isblank = false;
	
	switch(tagname_str)
	{
	case "select":
		
			Select e_tmp = new Select(element_tmp);
	
			int size_tmp = e_tmp.getAllSelectedOptions().size();
			
			System.out.println("Dropdown size:"+ size_tmp);
			
			if(size_tmp!=0)
			{
				observed = e_tmp.getAllSelectedOptions().get(0).getText();
				
			}
						
			else
			{
				Isblank = true;
			}
			
			break;
	
	case "input":
		
			if(element_tmp.getAttribute("type").equals("checkbox")||element_tmp.getAttribute("type").equals("radio"))
			{
				observed = Boolean.toString(element_tmp.isSelected());
				
			}
			else if(element_tmp.getAttribute("type").equals("text")
					||element_tmp.getAttribute("type").equals("tel")
					||element_tmp.getAttribute("type").equals("password")
					||element_tmp.getAttribute("type").equals("tel")
					||element_tmp.getAttribute("type").equals("number")) 
						observed = element_tmp.getAttribute("value");
			
			break;
	
	default: 
			observed = element_tmp.getText();
			appDriver.driver = SwitchIframe_func(null);
			
			break;
	}//end switch
	
	if(Isblank==true)
		observed = element_tmp.findElement(By.xpath("./../span")).getText();
	

	observed.trim();
	
	//if(element_tmp==Page_TinyContentBox()||element_tmp==Modal_TinyContentBox())
		 SwitchIframe_func(null);
	
	return observed;
}//end void



//METHOD:
public  void ScrollElementtoViewPort_func(WebElement element)
{
;

	int center_y = appDriver.getDriver().manage().window().getPosition().getY();

	((JavascriptExecutor)  appDriver.getDriver()).executeScript("window.scrollTo(0,"+center_y+")","");

	center_y = ((Number)((JavascriptExecutor)  appDriver.getDriver()).executeScript("return window.innerHeight","")).intValue();

	center_y= center_y/2+150;

	//int x = element.getLocation().getX();
	//Math math_c = new Math();
	int y =  element.getLocation().getY()-center_y;

	((JavascriptExecutor)  appDriver.getDriver()).executeScript("window.scrollTo(0,"+y+")","");

	//element.click()
}



//METHOD:
public  void VerifyDataExistTable_func(WebElement table, String expect_str,String note )
{
	Boolean exist = false;
	List<String> list_str = GetTableRecordsPerPaging_func(table);

	for(int i = 0;i <list_str.size();i++)
		if(list_str.get(i).contains(expect_str))
	{
		exist = true;
		break;
	}//end if

	if(exist==false)
	{
		GlobalConfigsReader.glb_TCStatus= false;
		GlobalConfigsReader.glb_TCFailedMessage+="Expect record not exist in table.[Observed: "+list_str+" - Expected: "+expect_str+"] "+note+".]\n";
	}
}//end void



//VERIFY RECORD ITEM NOT DISPLAY IN A TABLE
public  void VerifyDataNotExistTable_func(WebElement table, String expect_str,String note )
{
	Boolean exist = false;
	List<String> list_str = GetTableRecordsPerPaging_func(table);

	for(int i = 0;i <list_str.size();i++)
		if(list_str.get(i).contains(expect_str))
	{
		exist = true;
		break;
	}//end if

	if(exist==true)
	{
		GlobalConfigsReader.glb_TCStatus= false;
		GlobalConfigsReader.glb_TCFailedMessage+="Expect record Should NOT exist in table.[Observed: "+list_str+" - Expected: "+expect_str+"] "+note+".]\n";
	}
}//end void



public  boolean Is_Field_Editable_func(WebElement e,String value_str) {
	
	//	((JavascriptExecutor) webDriver).executeScript("arguments[0].click();", e);

	String tagname_str = e.getTagName();
	
	if(tagname_str.equals("select"))
	{
		return  e.isEnabled();
	}
	
	else
	{
		Optimize_ElementSendkey(e,value_str);
		
		appDriver.driver = SwitchIframe_func(null);	
		
		String observed_str = GetFieldText_func(e);
			
		if(observed_str.contains(value_str)) {
			return true;
		}
	}
		
	return false;
}//end void

public  void Select_Max_Table_Entries_Numb_func(WebElement element)
{
	Optimize_ElementClick(element);
	
	List<WebElement> list = Get_Dropdown_ItemsElement_func(element);
	
	int size = list.size();
	
	WebElement e = list.get(size-1);
	
	String item = e.getText();
	
	SelectDropdownItem(element, item, "");
	
}//end void

public void GoToLatestBrowserTab() {
	//NOTICE: default index must be = 0
	
	
	ArrayList<String> tabs2 = new ArrayList<String> (appDriver.getDriver().getWindowHandles());
	
	System.out.println(tabs2.size());
	
	
	appDriver.getDriver().switchTo().window(tabs2.get(tabs2.size()-1));
		
	//	ARCLoading.Wait_Util_FinishedARClogoLoading();
		
	}

public  void CloseBrowserTab() {
	//NOTICE: default index must be = 1
		
	ArrayList<String> tabs2 = new ArrayList<String> (appDriver.getDriver().getWindowHandles());
	//		System.out.println(tabs2)
	//		webDriver.switchTo().window(tabs2.get(index));
	
	if(tabs2.size()>1)
	{
		appDriver.getDriver().close();
		appDriver.getDriver().switchTo().window(tabs2.get(0));
	}
}




}
*/
