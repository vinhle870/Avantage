package ProjectContext.custom_Func;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Locale;

public class Data_Optimize {

	public Data_Optimize() {
		// TODO Auto-generated constructor stub
	}
	
	
	public static Double ConvertStringToDouble(String input_str) {

		String temp_str = input_str.replace(",", "");

		Double f = Double.parseDouble(temp_str);
		/*
		 *Double output_str = Double.parseDouble(input_str);
		DecimalFormat formatter = new DecimalFormat(format);
		String result = formatter.format(output_str);
		 
		 */

		return f;
	}

	
	public static String FormatStringWithDecimal(String input_str,int decimal_numb) {
		
		Double d = ConvertStringToDouble(input_str);

		DecimalFormat df = new DecimalFormat("%."+Integer.toString(decimal_numb)+"f");

		String result = df.format(d);
		
		return result;
	}
	
	
	public static String Format_Double_WithCurrency(double input_str)
	{
		String result = NumberFormat.getCurrencyInstance(new Locale("en", "US")).format(input_str);
		
		return result;
	}
	
	public static String Convert_Double_To_String_func(double numb,String format)
	{
		//
		String result = "";
		if(format.equals(""))
			format = "%,.2f";
		
		//DecimalFormat formatter = new DecimalFormat("###,###.##", symbols);
		//NumberFormat formatter = NumberFormat.getInstance(new Locale("en_US"));

		result = String.format(format, numb);
		
				
		
		return result; 
	}

}
