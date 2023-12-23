import org.junit.Test;
import static com.codeborne.selenide.Selenide.*;
public class Test20 {
    @Test
    public void TestA(){
        open("https://fox-pizza.ru/");
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[1]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestB(){
        $x("//*[@id=\"bx_3966226736_601643_7e1b8e3524755c391129a9d7e6f2d206\"]/div/div[2]/div[2]/div[3]/div[2]/button").click();
        sleep(1000);
    }
    @Test
    public void TestC(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[2]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestD(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[3]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestE(){
        $x("//*[@id=\"bx_1970176138_375671_6b95e91a2856336c040bd40120617e3e\"]/div/div[2]/div[2]/div[2]/div[2]/button").click();
        sleep(1000);
    }
    @Test
    public void TestF(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[4]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestG(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[5]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestH(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[6]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestI(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[2]/nav/ul/li[7]/a/span").click();
        sleep(1000);
    }
    @Test
    public void TestJ(){
        $x("//*[@id=\"app\"]/div[2]/div/aside[3]/div/div/a").click();
        sleep(1000);
    }
    @Test
    public void TestK(){
        $x("//*[@id=\"app\"]/section/div/div/div/div/div/div[4]/div/button").click();
        sleep(1000);
    }
    @Test
    public void TestL(){
        $x("//*[@id=\"app\"]/section/div/div/div/div/div/div[4]/div[2]/div/div[1]/div/div[2]/div[1]/div/div/input").setValue("Елизавета").pressEnter();
        sleep(1000);
    }
    @Test
    public void TestM(){
        $x("//*[@id=\"order-phone\"]").setValue("89576152299").pressEnter();
        sleep(1000);
    }
    @Test
    public void TestN(){
        $x("//*[@id=\"deliveryStreet\"]").setValue("Ленина 12, 4").pressEnter();
        sleep(1000);
    }
    @Test
    public void TestO(){
        $x("//*[@id=\"app\"]/section/div/div/div/div/div/div[4]/div[2]/div/div[1]/div/div[4]/div[1]/div/label[2]/span").click();
        sleep(1000);
    }
    @Test
    public void TestP(){
        $x("//*[@id=\"app\"]/section/div/div/div/div/div/div[4]/div[2]/div/div[1]/div/div[6]/div/div/div/div/label/div/span").click();
        sleep(1000);
    }
    @Test
    public void TestQ(){
        $x("//*[@id=\"app\"]/footer/div/div[1]/div[1]/a[1]").click();
        sleep(1000);
    }
    @Test
    public void TestR(){
        $x("//*[@id=\"app\"]/footer/div/div[1]/div[1]/a[2]").click();
        sleep(1000);
    }
    @Test
    public void TestS(){
        $x("//*[@id=\"app\"]/footer/div/div[1]/div[1]/a[3]").click();
        sleep(1000);
    }
    @Test
    public void TestT(){
        $x("//*[@id=\"app\"]/section[1]/div/div/div[1]/label[2]").click();
        sleep(1000);
    }
}
