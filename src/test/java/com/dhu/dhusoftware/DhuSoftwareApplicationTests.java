package com.dhu.dhusoftware;
import com.dhu.dhusoftware.pojo.LomBookTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DhuSoftwareApplicationTests {

    @Test
    void contextLoads() {
    }
    @Test
    void testLomBook(){
        LomBookTest lomBookTest = new LomBookTest(1,"2");
        System.out.println(lomBookTest.toString());
    }

}
