import org.junit.Test;

import static com.codeborne.selenide.Selenide.*;

public class test {
    @Test
    public void userCanLoginByUsername() {
        open("https://www.google.ru/");
        $x("//textarea[@name='q']").setValue("Королькова Елизавета Евгеньевна").pressEnter();
        sleep(1000);
       }
}
