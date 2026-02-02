package ProjectContext.custom_Func;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/*
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSchException;
*/
public class DateTime_Manage {
  public static Date ServerDate;

  public DateTime_Manage() {
    // TODO Auto-generated constructor stub
    ServerDate = null;
  }

  public static Date GetLocalDatetime() {

    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss");
    //DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

    LocalDateTime now    = LocalDateTime.now();
    String        output = now.format(dtf);

    SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");

    Date d_temp = null;
    try {
      d_temp = formatter.parse(output);
    } catch (ParseException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

    return d_temp;

  }


  public static String getCurrentLocalTime() {

    ///DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss");
    LocalDateTime now = LocalDateTime.now();

    String return_str = Integer.toString(now.getHour()) + Integer.toString(now.getMinute()) + Integer.toString(now.getSecond());
    //String return_str =
    return return_str;
  }

  public static String getCurrentLocalTime_HHMM() {

    //DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss");

    LocalDateTime now = LocalDateTime.now();

    String hr_tmp  = String.format("%02d", now.getHour());
    String min_tmp = String.format("%02d", now.getMinute());

    String return_str = hr_tmp + ":" + min_tmp;

    //String return_str = Integer.toString(now.getHour())+":"+  Integer.toString(now.getMinute());


    return return_str;
  }

  public static Date GetCurrentLocalDate_Date() {
    //timedatectl set-time '2018-05-25 11:10:40'
    DateTimeFormatter dtf    = DateTimeFormatter.ofPattern("MM/dd/yyyy");
    LocalDateTime     now    = LocalDateTime.now();
    String            output = dtf.format(now);
    Date              d_temp = null;
    try {
      d_temp = ConvertStringtoDate(output);
    } catch (ParseException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    return d_temp;
  }

  public static String GetCurrentLocalDate_Str() {
    DateTimeFormatter dtf    = DateTimeFormatter.ofPattern("MM/dd/yyyy");
    LocalDateTime     now    = LocalDateTime.now();
    String            output = dtf.format(now);
    return output;
  }

  /*
  public static void GetServerDateTime() {

    String result ="";
    DataBaseManage dbconnect = new DataBaseManage();
    dbconnect.OpenSSHSessionWithKey();

    int index = 0;
    String output_str = "";
    String servertime = "";
    ChannelExec channel;
    try {
      channel = (ChannelExec)dbconnect.session.openChannel("exec");

    InputStream in_temp = channel.getInputStream();
    channel.setCommand("date");
    channel.connect();

    BufferedReader reader = new BufferedReader(new InputStreamReader(in_temp));
    String line;
    while ((line = reader.readLine()) != null) {
      //System.out.System.out.println(++index + " : " + line);
      result = line;
    }//while

    channel.disconnect();
    dbconnect.session.disconnect();


    String format_str = "E MMM dd HH:mm:ss z yyyy";
    //String format_str = "YYYY MMM dd HH:mm:ss"
    SimpleDateFormat formatter =new SimpleDateFormat(format_str);
    //formatter.setTimeZone(TimeZone.getTimeZone("UTC"))
    Date date =formatter.parse(result);

    ServerDate = date;
    } catch (JSchException | IOException | ParseException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }


  public void ChangeServerTime(String time) {
    //datetime += " 11:00:00"
    DataBaseManage dbconnect = new DataBaseManage();
    dbconnect.OpenSSHSessionWithKey();

    int index=0;
    ChannelExec channel;
    try {
      channel = (ChannelExec)dbconnect.session.openChannel("exec");

    InputStream in_temp = channel.getInputStream();
    channel.setCommand("timedatectl set-ntp 0");
    channel.connect();
    channel.disconnect();

    channel= (ChannelExec)dbconnect.session.openChannel("exec");
    in_temp = channel.getInputStream();
    channel.setCommand("timedatectl set-time '"+time+"'");
    channel.connect();
    channel.disconnect();

    dbconnect.session.disconnect();
    } catch (JSchException | IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

  }

  public void IncreaseServerDay(Date orginial_date, int add_day) {

    Date temp_date = orginial_date;
    temp_date.setDate(temp_date.getDate()+add_day);

    System.out.println(temp_date);
    //2018-06-18 8:00:00

    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
    String strDate = formatter.format(temp_date);
    System.out.println(strDate);
    this.ChangeServerTime(strDate);

  }

  public void IncreaseServerDay(int add_day) {

    GetServerDateTime();
    ServerDate.setHours(ServerDate.getDate()+add_day);

    //System.out.println(temp_date)
    //2018-06-18 8:00:00

    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
    String strDate = formatter.format(ServerDate);
    //System.out.println(strDate)
    ChangeServerTime(strDate);

  }


  public void IncreaseServerHour(int add_hour) throws ParseException {

    this.GetServerDateTime();
    this.ServerDate.setHours(this.ServerDate.getHours()+add_hour);

    System.out.println(this.ServerDate);
    //2018-06-18 8:00:00;

    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
    formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
    String strDate = formatter.format(this.ServerDate);
    System.out.println("UTC date 12format: "+ strDate);
    this.ServerDate = formatter.parse(strDate);

    formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
    strDate = formatter.format(this.ServerDate);
    System.out.println("UTC date 24format: "+ strDate);
    this.ChangeServerTime(strDate);
  }

  public void RollBackServerTime() throws JSchException, IOException {
    DataBaseManage dbconnect = new DataBaseManage();
    dbconnect.OpenSSHSessionWithKey();
    String output_str = "";
    String servertime ="";
    ChannelExec channel= (ChannelExec)dbconnect.session.openChannel("exec");
    InputStream in_temp = channel.getInputStream();
    channel.setCommand("timedatectl set-ntp 1");
    channel.connect();
    channel.disconnect();
    dbconnect.session.disconnect();
  }

*/
  public static Date IncreaseDay(Date orgindate, int add_day) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(orgindate);
    cal.add(Calendar.DATE, add_day);
    return cal.getTime();
  }

  public static Date Get_DateTime_WithTimeZone(String timezone) {
    //Descrition: this also include the saved time
    //timezone = TestConfigs.glb_ARCUser_TimeZone;
    Date date_tmp = GetLocalDatetime();
    try {


      //2018-06-18 8:00:00

      SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");

      formatter.setTimeZone(TimeZone.getTimeZone(timezone));

      String strDate = formatter.format(date_tmp);

      date_tmp = formatter.parse(strDate);

      //format_string = "yyyy-MM-dd HH:mm:ss"

    } catch (ParseException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

    return date_tmp;
  }


  public static String FormatDateTime_WithTimeZone(String timezone, Date local_date, String format_str) {


    String strDate = "";
    try {
      if (format_str.equals("")) {
        format_str = "MM/dd/yyyy HH:mm";
      }


      Date temp_date = local_date;

      //System.out.println(temp_date);
      //2018-06-18 8:00:00

      SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");

      formatter.setTimeZone(TimeZone.getTimeZone(timezone));

      strDate = formatter.format(temp_date);

      //System.out.println("UTC date 12format: "+ strDate);

      temp_date = formatter.parse(strDate);
      //format_string = "yyyy-MM-dd HH:mm:ss"

      formatter = new SimpleDateFormat(format_str);

      //Default = "UTC"
      if (!timezone.equals("")) {
        formatter.setTimeZone(TimeZone.getTimeZone(timezone));
      } else {
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
      }

      strDate = formatter.format(temp_date);

      //System.out.println(timezone+" date 24format: "+ strDate);


    } catch (Exception e) {
      System.out.println(e);
    }
    return strDate;

  }


  public static String Format_DateTime_To_String(Date temp_date) {

    String strDate = "";

    DateFormat formatter = new SimpleDateFormat("MM/dd/yyyy HH:mm");

    strDate = formatter.format(temp_date);

    //System.out.println(strDate);

    return strDate;
  }


  public static String ConvertDatetoString(Date temp_date) {

    //SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
    SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
    String           strDate   = formatter.format(temp_date);
    //System.out.println(strDate);
    return strDate;
  }

  public static Date ConvertStringtoDate(String temp_date) throws ParseException {

    //SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
    SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");

    Date strDate = formatter.parse(temp_date);
    return strDate;
  }

  public static Date increase_bussiness_day_func(Date currentdate, int days) {
    Date dt = currentdate;
    //int day = dt.getday
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(currentdate);

    for (int i = 1; i <= days; i++) {
      int current_day = calendar.get(Calendar.DAY_OF_WEEK);
      if (current_day == Calendar.FRIDAY) {
        calendar.add(Calendar.DATE, 3);
      } else if (current_day == Calendar.SATURDAY) {
        calendar.add(Calendar.DATE, 2);
      } else {
        calendar.add(Calendar.DATE, 1);
      }
    }//end for

    dt = calendar.getTime();

    return dt;

  }

  public static String Calculate_Days_Numb(String temp_date) throws ParseException {

    Calendar c1 = Calendar.getInstance();

    Calendar c2 = Calendar.getInstance();

    Date today = DateTime_Manage.GetCurrentLocalDate_Date();

    Date date = DateTime_Manage.ConvertStringtoDate(temp_date);

    c1.setTime(today);

    c2.setTime(date);

    long noDay = (c1.getTime().getTime() - c2.getTime().getTime()) / (24 * 3600 * 1000);

    String str = String.valueOf(noDay);

    return str;

  }


}
